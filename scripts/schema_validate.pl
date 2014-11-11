use JSON::Schema;
use JSON;

$text_schema .= $_ while (<>);
my $schema = JSON::Schema->new(JSON::from_json($text_schema));

use YAML;
open my $ylf, '<', 'layouts/og.en-UK-100.yml';
$yl .= $_ while <$ylf>;
my $layout = YAML::Load ($yl);

print $schema->validate ($layout);
